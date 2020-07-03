import * as gulp from "gulp"
import * as browserify from "browserify"
import * as tsify from "tsify"
import * as source from "vinyl-source-stream"

/**
 * Return a gulp task function to browserify and transpile
 * the Typescript source in `dirName` inside `srcDir` to `outDir`.
 *
 * Assumes `${srcDir}/${dirName}` exists, and contains an entry file
 * named `${dirName}.ts`. Places output in `${outDir}/${dirName}.js`.
 *
 * @param dirName - dir name
 * @param srcDir - source dir
 * @param outDir - output dir
 */
const compileSrcDirTask = (
    dirName: string,
    srcDir: string = "src",
    outDir: string = "build",
): NodeJS.ReadWriteStream => {
    return browserify([`${dirName}.ts`], {
        basedir: `${srcDir}/${dirName}`,
        debug: true,
    })
        .plugin(tsify, {noImplicitAny: true})
        .bundle()
        .pipe(source(`${dirName}.js`))
        .pipe(gulp.dest(outDir))
}

/**
 * Return a gulp task function to copy `filePath`
 * to `outDir`.
 *
 * @param fileName - file to be copied
 * @param srcDir - path to dir containing `fileName`
 * @param outDir - output dir
 */
const copySrcFileTask = (
    fileName: string,
    srcDir: string = "src",
    outDir: string = "build",
): NodeJS.ReadWriteStream => {
    return gulp.src(`${srcDir}/${fileName}`).pipe(gulp.dest(outDir))
}

gulp.task("compile:background", () => compileSrcDirTask("background"))
gulp.task("copy:backgroundHtml", () =>
    copySrcFileTask("background/background.html"),
)
gulp.task(
    "build:background",
    gulp.parallel("compile:background", "copy:backgroundHtml"),
)

gulp.task("compile:options", () => compileSrcDirTask("options"))
gulp.task("copy:optionsHtml", () => copySrcFileTask("options/options.html"))
gulp.task("build:options", gulp.parallel("compile:options", "copy:optionsHtml"))

gulp.task("compile:content", () => compileSrcDirTask("content"))
gulp.task("build:content", gulp.task("compile:content"))

gulp.task(
    "build",
    gulp.parallel("build:background", "build:options", "build:content"),
)

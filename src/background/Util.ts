export class Util {
  static deepCopyJson<T extends any>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
  }
}

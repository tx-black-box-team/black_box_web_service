import Service from '..'

interface ParserBase<T> {
  parse(url: string): Promise<T>
}

export class ParserService extends Service implements ParserBase<any> {
  constructor (path: string = 'http://bang.tx3.163.com/bang') {
    super(path)
  }

  public parse(url = '/role/15_42046' ): Promise<any> {
    return new Promise((resolve) => {
      super.get(url, {}, resolve)
    })
  }
}

export default ParserService
import Service from '..'

export class ParserService extends Service {
  constructor (path: string = 'https://jsonplaceholder.typicode.com') {
    super(path)
  }

  public ping() {
    return new Promise((resolve) => {
      super.get('/posts/1', {}, resolve)
    })
  }
}

export default ParserService
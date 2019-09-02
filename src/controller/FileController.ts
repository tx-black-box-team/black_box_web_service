import {NextFunction, Request, Response} from 'express'
import { Controller, Get, Post, Delete} from '../decorators'
import * as fs from 'fs'

@Controller('/local/file')
export class FileController {
  @Get('/bg.jpeg')
  public async getBackground (request: Request, response: Response, next: NextFunction) {
    const str: string = request.query.img
    const path = `src/file//bg/${str}`
    const img = await new Promise((resolve) => {
      fs.readFile(path, {}, (err, data) => {
        if (err) throw err
        resolve(data)
      })
    })
    return img
  }
}
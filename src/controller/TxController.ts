import {NextFunction, Request, Response} from 'express'
import { Controller, Get, Post, Delete} from '../decorators'

@Controller('/local/tx')
export class TxController​​ {
  @Get('/role')
  public roleAnalysis (request: Request, response: Response, next: NextFunction) {
    const roleId: string = request.query.roleId

  }
}

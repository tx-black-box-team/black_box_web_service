import {NextFunction, Request, Response} from 'express'
import account from '../bean'
import { Controller, Get, Post, Delete} from '../decorators'

const Core = require('@alicloud/pop-core')
const crypto = require('crypto')

@Controller('/api/users')
export class UserController {

	public client: any = new Core({
		accessKeyId: account.msg_id,
		accessKeySecret: account.msg_app_secret,
		endpoint: account.endpoint,
		apiVersion: account.api_version
	})

	@Get('/send_msg')
	public async send_msg(request: Request, response: Response, next: NextFunction) {

		const code = Math.random().toString().slice(-6)
		const params: any = {
			PhoneNumbers: request.query.phone,
			SignName: account.sign_name,
			TemplateCode: account.template_code,
			TemplateParam: account.template_params(code)
		}
		const request_option: any = {
			method: 'POST'
		}
		let response_data !: any

		try {
			response_data = await this.client.request('SendSms', params, request_option)
		} catch (err) {
			return {
				status: 1,
				msg: err.data.Message
			}
		}
		if (response_data.Code === 'OK') {
			return {
				status: 0,
				msg: 'OK'
			}
		} else {
			return {
				status: 1,
				msg: 'Error'
			}
		}
	}
}
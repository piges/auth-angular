import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { PigesAuthService } from './piges-auth.service';

@Injectable()
export class PigesAuthGuard implements CanActivate {
    
    constructor(
		private pigesAuthService: PigesAuthService
	) { }
    
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		let login = false;
		try {
			let userInfo = await this.pigesAuthService.getUser();
			if(userInfo != null) {
				login = true;
			}
		} catch (error) {
			console.log("Piges Auth log:", "Not logged user!");
		} finally {
			if(!login) {
				this.pigesAuthService.loginRedirect();
			}
			return login;
		}
	}
}

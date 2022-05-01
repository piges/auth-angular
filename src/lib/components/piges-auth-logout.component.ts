import { Component, OnInit } from '@angular/core';
import { PigesAuthService } from '../services/piges-auth.service';

@Component({
	templateUrl: './piges-auth-logout.component.html'
})
export class PigesAuthLogoutComponent implements OnInit {
	constructor(
		private pigesAuthService: PigesAuthService,
	) { }

	error: any;

	ngOnInit(): void {
		if(this.pigesAuthService.getLogoutUrl() === undefined) {
			this.error = "LOGOUT URL NOT DEFINED!";
			return;
		}
		this.pigesAuthService.logout("");//todo put url callback
	}
}

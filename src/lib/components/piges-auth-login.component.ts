import { Component, OnInit } from '@angular/core';
import { PigesAuthService } from '../services/piges-auth.service';

@Component({
	templateUrl: './piges-auth-login.component.html',
})
export class PigesAuthLoginComponent implements OnInit {
	constructor(
		private pigesAuthService: PigesAuthService,
	) { }

	ngOnInit(): void {
		this.pigesAuthService.loginRedirect();
	}
	
}

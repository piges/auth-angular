import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LocalStorageService } from 'ngx-webstorage';
import { LocalStorage } from '@ngx-pwa/local-storage';


import { STORAGE_KEY } from '../piges-auth.export';
import { PigesAuthService } from '../services/piges-auth.service';

@Component({
	templateUrl: './piges-auth-callback.component.html',

})
export class PigesAuthCallbackComponent implements OnInit {
	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private localStorage: LocalStorageService,
		private pigesAuthService: PigesAuthService,
	) { }

	ngOnInit(): void {
		this.load();
	}

	async load() {
		// TODO gestire autenticazione con codice e non solo quella implicita
		let fragmentMap: any = { };
		if(this.activatedRoute.snapshot.fragment === null) {
			throw 'no_parameters_passed';
		}
		this.activatedRoute.snapshot.fragment.split("&").forEach((fragment: string) => {
			let fragmentVals = fragment.split("=");
			fragmentMap[fragmentVals[0]] = fragmentVals[1];
		});
		
		this.localStorage.store(STORAGE_KEY, fragmentMap);
				
		// todo navigate to back url
		// forse sarebbe meglio mettere redirect javascript e non route
		//this.router.navigateByUrl('/');
		window.location.replace("/");
	}
	
}

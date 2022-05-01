import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';

import { LocalStorageService } from 'ngx-webstorage';
import { Observable, Subject } from 'rxjs';

import { PIGES_CONFIG, STORAGE_KEY } from '../piges-auth.export';
import { IPigesConfig } from '../interface/piges-config';

@Injectable()
export class PigesAuthService {
	private authenticationState = new Subject<boolean>();

	$authenticationState: Observable<boolean>;

	pigesConfig: IPigesConfig;

	constructor(
		private localStorage: LocalStorageService,
		private http: HttpClient,
		@Inject(PIGES_CONFIG) pigesConfig: IPigesConfig,
		@Inject(PLATFORM_ID) private platformId: Object,
		@Optional() @Inject('httpResponseData') private httpResponseData: any
	) {
		if(pigesConfig._authorizeUrl === undefined) {
			pigesConfig._authorizeUrl = 'https://account.piges.io';
		}
		if(pigesConfig._serverUrl === undefined) {
			pigesConfig._serverUrl = 'https://auth.piges.io';
		}
		this.pigesConfig = pigesConfig;
		this.$authenticationState = this.authenticationState.asObservable();
	}

	private _tokenReading: boolean = false;
	private _tokenInMemory: any;

	private _userReading: boolean = false;
	private _userInfo: any;

	getAuthorizationUrl(idpIdentifier: string = this.pigesConfig.idp_identifier, state: string = "") {
		let authorizationUrl = `${this.pigesConfig._authorizeUrl}/authorize?`;
		authorizationUrl += `&response_type=token`;
		authorizationUrl += `&client_id=${this.pigesConfig.clientId}`;
		authorizationUrl += `&redirect_uri=${this.pigesConfig.redirectUrl}`;

		if(idpIdentifier !== undefined && idpIdentifier !== "") {
			authorizationUrl += `&idp_identifier=${idpIdentifier}`;
		}

		if(state !== undefined && state !== "") {
			authorizationUrl += `&state=${state}`;
		}
		
		return authorizationUrl;
	}

	async isAuthenticated(): Promise<boolean> {
		try {
			let user = await this.getUser();
			if (user !== undefined) {
				return true;
			}
		} catch (error) {

		}
		return false;
	}

	getLogoutUrl(): string {
		return this.pigesConfig.redirectUrl;
	}


	private async getToken(): Promise<any> {
		if (this._tokenReading) {
			await this.delay(100);
			return this.getToken();
		}
		if (this._tokenInMemory === undefined) {
			this._tokenReading = true;
			let tokenInMemory = this.localStorage.retrieve(STORAGE_KEY);
			if (tokenInMemory !== null) {
				this._tokenInMemory = tokenInMemory;
			}
			this._tokenReading = false;
		}
		return this._tokenInMemory;
	}

	async getUser(forceReload: boolean = false, n: number = 1): Promise<any> {
		if (this._userReading) {
			await this.delay(100);
			return this.getUser(false, ++n);
		}
		if (this._userInfo === undefined || forceReload) {
			this._userReading = true;
			try {
				let token = await this.getToken();

				if (token === undefined) {
					throw 'not_logged_user';
				}

				try {
					this._userInfo = await this.http.get(this.pigesConfig._serverUrl + "/oauth2/userInfo", {
						headers: new HttpHeaders().set('Authorization', 'Bearer ' + token.access_token),
					}).toPromise();
				} catch (e) {
					console.log("Piges Auth log:", "Expired token!");
					throw 'expired_token';
				}

				if (this._userInfo !== null) {
					this.authenticationState.next(true);
				}
			} catch (error) {
				this.authenticationState.next(false);
				throw error;
			} finally {
				this._userReading = false;
			}
		}
		return this._userInfo;
	}

	async getAccessToken() {
		let token = await this.getToken();
		return token.access_token;
	}

	loginRedirect(idpIdentifier: string = this.pigesConfig.idp_identifier, fromUri?: string, additionalParams?: any) {
		//TODO FARE URL DI CALBACK salvandosi attuale url
		this.redirect(this.getAuthorizationUrl(idpIdentifier));
	}

	async logout(uri: string) {
		this.localStorage.clear(STORAGE_KEY);
		this._tokenInMemory = undefined;
		this._userInfo = undefined;

		let url = `${this.pigesConfig._serverUrl}/logout?client_id=${this.pigesConfig.clientId}&logout_uri=${uri}`;
		this.redirect(url);
	}

	private delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	private redirect(url: string) {
		if (this.platformId == "browser") {
			window.location.href = url;
		} else {
			console.log(this.platformId);
			this.httpResponseData.redirectUrl = url;
		}
	}
}
# PigesAngularAuth

Library for use security funcionality of piges PaaS in angular

## Installation

``` bash
npm i @piges/auth-angular
```

## Usage

Import and configure module

``` typescript
// myApp.module.ts

import { PigesAuthModule, PIGES_CONFIG, IPigesConfig } from '@piges/auth-angular';

const pigesConfig = {
	clientId: '-----------------------',
	redirectUrl: 'https://your-app-url.tld/piges/auth/callback',
	//idp_identifier: '',
	//clientSecret: '',
}

@NgModule({
  imports: [
    ...
    PigesAuthModule
  ],
  providers: [
    { 
      provide: PIGES_CONFIG, 
      useValue: { pigesConfig } 
    }
  ],
})
export class MyAppModule { }

```

Use PigesAuthGuard for protect your route

``` typescript
// myApp.route.ts

import { PigesAuthGuard } from '@piges/auth-angular';

const routes: Routes = [
	{
		path: 'secure-page',
		canActivate : [
			PigesAuthGuard
		],
		component: SecureComponent,
	},
	...
];

```

Manage the login redirect and login callback with route

``` typescript
// myApp.route.ts

import { PigesAuthLoginComponent, PigesAuthCallbackComponent } from '@piges/auth-angular';

const routes: Routes = [
	{
		path: 'piges/auth',
		children: [
			{
				path: 'login',
				component: PigesAuthLoginComponent,
			},
			{
				path: 'callback',
				component: PigesAuthCallbackComponent
			},
		]
	},
	...
];

```


Get user info in your component

``` typescript
// my.component.ts

import { PigesAuthService } from '@piges/auth-angular';

export class MyComponent {
	constructor(
		private pigesAuthService: PigesAuthService,
	) {}

	userInfo: any = {};

	ngOnInit(): void {
		this.loadUser();
	}

	async loadUser() {
		this.userInfo = await this.pigesAuthService.getUser();
	}

}

```

## License

[MIT](LICENSE)
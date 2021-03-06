import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { PigesAuthService } from './services/piges-auth.service';
import { PigesAuthGuard } from './services/piges-auth-guard.service';

import { PigesAuthCallbackComponent } from './components/piges-auth-callback.component';
import { PigesAuthLoginComponent } from './components/piges-auth-login.component';
import { PigesAuthLogoutComponent } from './components/piges-auth-logout.component';

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		NgxWebstorageModule.forRoot(),

	],
	providers: [
		PigesAuthService,
		PigesAuthGuard,

	],
	declarations: [
		PigesAuthCallbackComponent,
		PigesAuthLoginComponent,
		PigesAuthLogoutComponent,

	],
	exports: [
		PigesAuthCallbackComponent,
		PigesAuthLoginComponent,
		PigesAuthLogoutComponent,

	],
})
export class PigesAuthModule {}
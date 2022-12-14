import { StrongFBFormClass } from "../../common/StrongFB-base";
import { StrongFBWidget } from "../../common/StrongFB-decorators";
import { StrongFBButtonWidget } from "../../widgets/button/button.header";
import { StrongFBCardWidget } from "../../widgets/card/card.header";
import { StrongFBFormFieldWidget } from "../../widgets/form-field/form-field.header";
import { InputSchema } from "../../widgets/input/input-interfaces";
import { StrongFBInputWidget } from "../../widgets/input/input.header";

type widgets = 'usernameField' | 'passwordField' | 'loginButton' | 'loginCard' | 'passwordInput';

type locales = 'login'
/**
 * widgets:
 * card: on center of window
 * input: username field
 * input: password field
 * button: login button 
 */
interface loginFormFields {
    username: string;
    password: string;
}
export class LoginPageForm extends StrongFBFormClass<widgets, loginFormFields, object, locales> {
    showPassword = false;
    public override defaultLocaleNamespace: "login" = 'login';
    // formFields = {
    //     username: this.fieldModel(''),
    //     password: this.fieldModel(''),
    // }
    // =>after layout complete
    override async onInit() {
        // this.updateFormFields({
        //     username: 'admin',
        //     password: '4564324rfd4r2dfd'
        // })
    }

    override get layout() {
        return this.layoutBuilder().centerScreenBox().widget(this.loginCard).finish();
    }
    loginCard() {
        // console.log('this;', this)
        return new StrongFBCardWidget().header(this.__("Workflow Engine Service Frontend")).content(
            this.layoutBuilder().columnBox().widget([
                this.usernameField,
                this.passwordField,
            ]).finish()).footer(this.layoutBuilder().rowBox().widget(this.loginButton).finish());
    }

    usernameField() {
        return new StrongFBFormFieldWidget().field(new StrongFBInputWidget<loginFormFields>().placeholder(this.__('username')).formFieldName('username').keyup.enter(() => {
            this.loginAction();
        }));
    }

    passwordField() {
        return new StrongFBFormFieldWidget().field(
            new StrongFBInputWidget<loginFormFields>().type('password').formFieldName('password').name('passwordInput').placeholder(this.__('password')).keyup.enter(() => {
                this.loginAction();
            })
        ).suffixButton(new StrongFBButtonWidget().icon('eye-outline').mode('icon').click((ev, self) => {
            // console.log(this['_usedWidgets'])
            if (this.showPassword) {
                self.icon('eye-outline');
                this.findWidgetByName<StrongFBInputWidget>('passwordInput').type('password');

            } else {
                self.icon('eye-off-2-outline');
                this.findWidgetByName<StrongFBInputWidget>('passwordInput').type('text');

            }
            this.showPassword = !this.showPassword;
        }));
    }

    loginButton() {
        return new StrongFBButtonWidget().name('loginButton').text(this.__('login')).appearance('colorful').status('primary').click(async (ev, self) => {
            this.loginAction();
        });
    }

    async loginAction() {
        let res = await this.http.post('/token', {
            username: this.formFieldValues().username,
            secret_key: this.formFieldValues().password,
        });
        console.log(res)
        // =>if success
        if (res.result && res.statusCode < 300) {
            this.http.setToken(res.result.data.access_token);
            this.http.setRefreshToken(res.result.data.refresh_token);
            this.service.goToPage('dashboard');
        }
        // =>if failed
        else {
            this.notify('username or password is not valid!', 'failure');
        }
    }
}
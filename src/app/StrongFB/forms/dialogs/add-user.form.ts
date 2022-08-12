import { Validators } from "@angular/forms";
import { StrongFBFormClass } from "../../common/StrongFB-base";
import { StrongFBValidator } from "../../common/StrongFB-validator";
import { StrongFBFormFieldWidget } from "../../widgets/form-field/form-field.header";
import { StrongFBInputWidget } from "../../widgets/input/input.header";
import { StrongFBTagsListWidget } from "../../widgets/tags-list/tags-list.header";
import { StrongFBTextAreaWidget } from "../../widgets/textarea/textarea.header";

type widgets = 'cartableTable' | 'refreshButton';

interface InitData {
    workflow_name: string;
    workflow_version: number;
    name: string;
    required_fields: string[];
    optional_fields: string[];
}




export class AddUserForm extends StrongFBFormClass<widgets, object, InitData> {
    required_fields: { name: string; type: 'string' }[] = [];
    override get layout() {
        return this.layoutBuilder().columnBox().layout([
            this.layoutBuilder().columnBox({ style: { 'min-width': '300px' } })
                .widget(this.usernameField)
                .widget(this.emailField)
                .widget(this.passwordField)
                .widget(this.rolesField)
                .finish(),
        ]).finish();
    }

    override async onInit() {

    }

    usernameField() {
        return new StrongFBFormFieldWidget().field(new StrongFBInputWidget().formFieldName('name')).label('username').validator(new StrongFBValidator().required());
    }

    emailField() {
        return new StrongFBFormFieldWidget().field(new StrongFBInputWidget().formFieldName('email')).label('email').validator(new StrongFBValidator().email());
    }

    passwordField() {
        return new StrongFBFormFieldWidget().field(new StrongFBInputWidget().formFieldName('secret_key').type('password')).label('password').validator(new StrongFBValidator().minLength(5));
    }

    rolesField() {
        return new StrongFBFormFieldWidget().field(new StrongFBTagsListWidget().separatorKeys(['comma']).formFieldName('roles')).label('roles');
    }

    messageField() {
        return new StrongFBTextAreaWidget().placeholder('message ...').formFieldName('message').maxWidth('600px');
    }
}
import { Validators } from "@angular/forms";
import { StrongFBFormClass } from "../../common/StrongFB-base";
import { StrongFBValidator } from "../../common/StrongFB-validator";
import { StrongFBFormFieldWidget } from "../../widgets/form-field/form-field.header";
import { StrongFBInputWidget } from "../../widgets/input/input.header";
import { StrongFBTextAreaWidget } from "../../widgets/textarea/textarea.header";

type widgets = 'cartableTable' | 'refreshButton';

interface InitData {
    workflow_name: string;
    workflow_version: number;
    name: string;
    required_fields: string[];
    optional_fields: string[];
}




export class ExecuteProcessActionForm extends StrongFBFormClass<widgets, object, InitData> {
    required_fields: { name: string; type: 'string' }[] = [];
    override get layout() {
        return this.layoutBuilder().columnBox().layout([
            this.layoutBuilder().columnBox().widgets(this.requiredFields).widget(this.messageField).finish(),
        ]).finish();
    }

    override async onInit() {
        // =>get workflow fields
        let fieldsRes = await this.http.get('/workflow/fields', {
            workflow_name: this.initialData.workflow_name,
            workflow_version: this.initialData.workflow_version,
        });
        // =>if failed
        if (fieldsRes.error) {
            console.error('error:', fieldsRes);
            return;
        }
        for (const field of this.initialData.required_fields) {
            this.required_fields.push(fieldsRes.result['data'].find(i => i.name === field));
        }

        console.log('init data:', this.initialData, fieldsRes.result['data'])
    }

    requiredFields() {
        let fields = [];
        for (const field of this.required_fields) {
            if (field.type === 'string') {
                fields.push(
                    new StrongFBFormFieldWidget()
                        .field(new StrongFBInputWidget().formFieldName(field.name))
                        .label(field.name)
                        .validator(new StrongFBValidator().required())
                );
            }
        }

        return fields;
    }

    messageField() {
        return new StrongFBTextAreaWidget().placeholder('message ...').formFieldName('message').maxWidth('600px');
    }
}
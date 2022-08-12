import { Validators } from "@angular/forms";
import { StrongFBFormClass } from "../../common/StrongFB-base";
import { StrongFBValidator } from "../../common/StrongFB-validator";
import { StrongFBFormFieldWidget } from "../../widgets/form-field/form-field.header";
import { StrongFBInputWidget } from "../../widgets/input/input.header";
import { StrongFBSelectWidget } from "../../widgets/select/select.header";
import { StrongFBTextAreaWidget } from "../../widgets/textarea/textarea.header";

type widgets = 'cartableTable' | 'refreshButton';

interface InitData {
    workflow_name: string;
    workflow_version: number;
    name: string;
    required_fields: string[];
    optional_fields: string[];
}




export class CreateProcessForm extends StrongFBFormClass<widgets, object, InitData> {
    required_fields: { name: string; type: 'string' }[] = [];
    override get layout() {
        return this.layoutBuilder().columnBox().layout([
            this.layoutBuilder().columnBox().widget(this.selectField).finish(),
        ]).finish();
    }

    override async onInit() {

    }

    selectField() {
        return new StrongFBFormFieldWidget().label('Select Workflow').field(new StrongFBSelectWidget().formFieldName('workflow_selected').fullWidth().appearance('colorful').status('info').loadOptions(async () => {
            // =>get workflow fields
            let workflowsRes = await this.http.get('/workflow/deployed-list', {
                access: 'create-access',
            });
            // =>if failed
            if (workflowsRes.error) {
                console.error('error:', workflowsRes);
                return [];
            }

            console.log('workflows:', workflowsRes.result['data'])

            return workflowsRes.result['data'].map(i => {
                return {
                    text: i.workflow_name + ' - v' + i.workflow_version,
                    value: i.workflow_name + '@' + i.workflow_version,
                }
            });
        })).minWidth('200px')
    }

}
import { Validators } from "@angular/forms";
import { StrongFBFormClass } from "../../common/StrongFB-base";
import { StrongFBValidator } from "../../common/StrongFB-validator";
import { StrongFBButtonWidget } from "../../widgets/button/button.header";
import { StrongFBFormFieldWidget } from "../../widgets/form-field/form-field.header";
import { StrongFBInputWidget } from "../../widgets/input/input.header";
import { TableColumnMapValue, TableTagColumnMapValue } from "../../widgets/table/table-interfaces";
import { StrongFBTableWidget } from "../../widgets/table/table.header";
import { StrongFBTextAreaWidget } from "../../widgets/textarea/textarea.header";
import { AddUserForm } from "../dialogs/add-user.form";

type widgets = 'usersTable' | 'refreshButton';

type TableColumns = 'index' | 'id' | 'name' | 'email' | 'options' | 'created_at' | 'roles';

interface InitData {
    workflow_name: string;
    workflow_version: number;
    name: string;
    required_fields: string[];
    optional_fields: string[];
}




export class AdminUsersPageForm extends StrongFBFormClass<widgets, object, InitData> {
    override get layout() {
        return this.layoutBuilder().columnBox().layout([
            this.layoutBuilder().gridBox()
                .gridColumnLayout({ desktop: 'col-9' }, this.layoutBuilder().box({ html: `<h1>Users</h1>` }).finish())
                .gridColumnLayout({ desktop: 'col-3' }, this.layoutBuilder().rowBox().styleCss('flex-direction', 'row-reverse').widget([this.refreshButton, this.addButton]).finish())
                .finish(),
            this.layoutBuilder().box().widget(this.usersTable).finish(),
        ]).finish()
    }

    refreshButton() {
        return new StrongFBButtonWidget().icon('refresh-outline').mode('iconButton').appearance('colorful').tooltip('Refresh').status('warning').click(() => {
            this.findWidgetByName<StrongFBTableWidget>('usersTable').updateRows();
        });
    }

    addButton() {
        return new StrongFBButtonWidget().icon('person-add-outline').mode('iconButton').appearance('colorful').status('primary').tooltip('Add new user').margin2x('0').click(async () => {
            (await this.service.dialog(AddUserForm, {
                title: 'Add new user',
                actions: [
                    {
                        text: 'Add',
                        status: 'success',
                        action: async (values) => {
                            console.log('user values:', values);
                            if (!values || !values['name']) return false;
                            let res = await this.http.post('/admin/user/add', { user: values });
                            // =>if success
                            if (res.result && res.result['data']) {
                                this.notify('added user', 'success');
                                this.findWidgetByName<StrongFBTableWidget>('usersTable').updateRows();
                                return true;
                            } else {
                                this.notify(res.error?.['data'], 'failure');
                                return false;
                            }
                        },
                    },
                    {
                        isCancel: true,
                    }

                ]
            })).instance.open();
        });
    }

    usersTable() {
        return new StrongFBTableWidget<TableColumns>().columns([
            { name: 'index', title: '#' },
            { name: 'id', title: 'ID' },
            { name: 'name', title: 'Username' },
            { name: 'email', title: 'Email' },
            { name: 'roles', title: 'Roles', type: 'tagsList' },
            { name: 'created_at', title: 'Created At' },
            { name: 'options', title: 'Options', type: 'actions' },
        ]).mapColumnValue('index', (row, i) => {
            return i + 1;
        }).mapColumnValue('created_at', (row, i) => {
            let date = new Date(row['created_at']);
            if (!row['created_at'] || !date) return '-';
            return date.toDateString() + ' - ' + date.toTimeString().substring(0, 8);
        }).mapColumnValue<TableTagColumnMapValue[]>('roles', (row, i) => {
            let roles = row['roles'];
            return roles.map(j => {
                return {
                    status: 'primary',
                    value: j,
                } as TableTagColumnMapValue
            })
        }).loadRowsByApi({
            path: '/admin/user/list',
            method: 'GET'
        }, (res, err) => {
            if (err) {
                console.warn('error:', err);
                return [];
            }
            console.log('res:', res['data'])
            return res['data'];
        }).mapActionsColumn('options', [
            // {
            //     mode: 'icon',
            //     icon: 'info-outline',
            //     text: 'Details',
            //     status: 'info',
            //     disabled: true,
            //     action: (row, i, self) => {
            //         alert('hello details');
            //     }
            // },
            // {
            //     mode: 'icon',
            //     icon: 'archive-outline',
            //     text: 'History',
            //     status: 'primary',
            //     disabled: true,
            //     action: (row, i, self) => {
            //         alert('hello history');
            //     }
            // },
        ]);
    }
}
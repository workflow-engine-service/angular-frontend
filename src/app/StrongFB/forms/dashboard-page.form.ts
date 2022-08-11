import { StrongFBFormClass } from "../common/StrongFB-base";
import { StrongFBLayoutBuilder } from "../common/StrongFB-layout-builder";
import { StrongFBButtonWidget } from "../widgets/button/button.header";
import { TableColumnAction, TableTagColumnMapValue } from "../widgets/table/table-interfaces";
import { StrongFBTableWidget } from "../widgets/table/table.header";
import { ExecuteProcessActionForm } from "./execute-process-action.form";

type widgets = 'cartableTable' | 'refreshButton';

type TableColumns = 'index' | 'pid' | 'workflow' | 'current_state' | 'actions' | 'options';



export class DashboardPageForm extends StrongFBFormClass<widgets> {

    override get layout() {
        return this.layoutBuilder().columnBox().layout([
            this.layoutBuilder().gridBox()
                .gridColumnLayout({ desktop: 'col-9' }, this.layoutBuilder().box({ html: `<h1>Dashboard</h1>` }).id('dashboard_text').finish())
                .gridColumnLayout({ desktop: 'col-3' }, this.layoutBuilder().rowBox().styleCss('flex-direction', 'row-reverse').widget(this.refreshButton).finish())
                .finish(),
            this.layoutBuilder().box().widget(this.cartableTable).finish(),
        ]).finish()
    }

    refreshButton() {
        return new StrongFBButtonWidget().icon('refresh-outline').mode('iconButton').appearance('colorful').status('warning').click(() => {
            this.findWidgetByName<StrongFBTableWidget>('cartableTable').updateRows();
        });
    }

    cartableTable() {
        return new StrongFBTableWidget<TableColumns>().columns([
            { name: 'index', title: '#' },
            { name: 'pid', title: 'Process ID' },
            { name: 'workflow', title: 'Workflow' },
            { name: 'current_state', title: 'State', type: 'tag' },
            { name: 'options', title: 'Options', type: 'actions' },
            { name: 'actions', title: 'Actions', type: 'actions' },
        ]).mapColumnValue('index', (row, i) => {
            return i + 1;
        }).mapColumnValue('workflow', (row, i) => {
            return row['workflow_name'] + ` (v${row['workflow_version']})`;
        }).mapColumnValue('pid', (row, i) => {
            return row['_id'];
        }).mapColumnValue<TableTagColumnMapValue>('current_state', (row, i) => {
            return {
                value: row['current_state'],
                status: 'info',
            }
        }).loadRowsByApi({
            path: '/workflow/list',
            method: 'GET'
        }, (res, err) => {
            if (err) {
                console.warn('error:', err);
                return [];
            }
            console.log('res:', res['data'])
            return res['data'];
        }).mapActionsColumn('options', [
            {
                mode: 'icon',
                icon: 'info-outline',
                text: 'Details',
                status: 'info',
                disabled: true,
                action: (row, i, self) => {
                    alert('hello details');
                }
            },
            {
                mode: 'icon',
                icon: 'archive-outline',
                text: 'History',
                status: 'primary',
                disabled: true,
                action: (row, i, self) => {
                    alert('hello history');
                }
            },
        ]).mapDynamicActionsColumn('actions', async (row, index) => {
            // =>get actions of current state
            let res = await this.http.get('/workflow/state-info', { process_id: row['_id'] });
            // =>if failed
            console.log('process actions:', res.result);
            if (!res.result || !res.result['data']) return [];
            let actions: TableColumnAction[] = [];
            for (const act of res.result.data.actions) {
                actions.push({
                    text: act.name,
                    appearance: 'outline',
                    status: 'primary',
                    action: async (row, i) => {
                        let dialogRef = await this.service.dialog(ExecuteProcessActionForm, {
                            title: act.name,
                            actions: [
                                {
                                    text: 'Apply',
                                    status: 'primary',
                                    action: async (values) => {
                                        console.log('values', values);
                                        // =>init form data
                                        let formData = new FormData();
                                        for (const key of Object.keys(values)) {
                                            if (key === 'message') {
                                                formData.append('message', values[key]);
                                            } else {
                                                formData.append(`field.${key}`, values[key]);
                                            }
                                        }
                                        formData.append('state_action', act.name);
                                        formData.append('process_id', row['_id']);
                                        // =>send params by api
                                        let res = await this.http.sendPromise({
                                            method: 'POST',
                                            path: '/workflow/action',
                                            formData,
                                        });
                                        // =>if failed
                                        if (res.error) {
                                            console.log('err:', res.error)
                                            this.notify(String(res.error.error['data']), 'failure');
                                            return false;
                                        } else {
                                            this.notify(`Added new worker with id '${res.result['data']}'`, 'success');
                                            return true;
                                        }
                                    }
                                },
                                {
                                    isCancel: true,
                                }
                            ],
                            data: { ...act, ...row },
                        });
                        // console.log('ref:', dialogRef);
                        await dialogRef.instance.open();
                    }
                })
            }
            return actions;

        });
    }

}
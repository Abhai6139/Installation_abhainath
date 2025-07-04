// Copyright (c) 2025, abhainath and contributors
// For license information, please see license.txt

frappe.ui.form.on("Installation Request", {
	delivery_note:function(frm){
        if(frm.doc.delivery_note){
            let total=0
            frappe.db.get_doc('Delivery Note',frm.doc.delivery_note).then(data=>{
                frm.set_value('customer',data.customer)
                frm.clear_table('installation_items')
                data.items.forEach(element => {
                    let row=frm.add_child('installation_items')
                    row.item_code=element.item_code
                    row.quantity=element.qty
                });
                frm.refresh_field('installation_items')
                data.items.forEach(qty=>{
                    total+=qty.qty
                })
                frm.set_value('total_quantity',total)
            })
        }
    },
    customer:function(frm){
        if(frm.doc.customer){
            frappe.db.get_value('Installation Zone',frm.doc.customer,'preferred_technician',(r)=>{
                frm.set_value('assigned_technician',r.preferred_technician)
            })
        }
    },
    refresh:function(frm){
        frm.set_df_property('installation_items','cannot_add_rows',true)
        frm.set_df_property('installation_items','cannot_delete_rows',true)
        if(frm.doc.docstatus==1){
            if(frm.doc.status=='Scheduled'){
                return
            }
            else{
                frm.add_custom_button('Schedule Installation',function(){
                    frappe.db.set_value('Installation Request',frm.doc.name,'status','Scheduled')
                    frappe.msgprint('Email notification sended')
                })
            }
            
        }
    },
    before_workflow_action:function(frm){
        if(frm.selected_workflow_action=='Submit for Approval'){
            if(frm.doc.total_quantity>10){
                frappe.warn('Are you sure you want to proceed?',
                    `<b>Total Quantity:</b> ${frm.doc.total_quantity}`, 
                () => {
                    frm.script_manager.trigger('proceed_workflow_action')
                },'Confirm',true
                )
            }
        }
    }
    

});

frappe.ui.form.on('Installation Items',{
    quantity:function(frm,cdt,cdn){
        let data=locals[cdt][cdn]
        if(data.quantity){
            update_qty(frm)
        }
        update_qty(frm)
    }
})

function update_qty(frm){
    let total1=0
    frm.doc.installation_items.forEach(function(row){
        if(row.quantity){
            total1+=row.quantity
        }
        
    })
    frm.set_value('total_quantity',total1)
}
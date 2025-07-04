# Copyright (c) 2025, abhainath and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import getdate, today


class InstallationRequest(Document):
	pass
	def validate(self):
		if getdate(self.installation_date) < getdate(today()):
			frappe.throw('Installation date cannot be in past')
		if self.total_quantity<=0:
			frappe.throw('Total Quantity cannot be 0')


	
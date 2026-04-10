"use client";

import { EnquiriesInbox } from "@/components/admin/enquiries-inbox";

const EnquiriesPage = () => {
    return (
        <div className="space-y-5">
            <section>
                <h1 className="text-2xl font-semibold tracking-tight">Enquiries Inbox</h1>
                <p className="mt-1 text-sm text-muted-foreground">Review and process incoming website enquiries.</p>
            </section>

            <EnquiriesInbox />
        </div>
    );
};

export default EnquiriesPage;

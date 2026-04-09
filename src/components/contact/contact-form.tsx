"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ContactForm = () => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        company: "",
        formStartedAt: "",
    });
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/enquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const err = await res.json();
                toast.error(err.error || "Could not send message.");
                return;
            }
            toast.success("Message sent successfully.");
            setForm((prev) => ({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
                company: "",
                formStartedAt: new Date().toISOString(),
            }));
        } catch {
            toast.error("Could not send message.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setForm((prev) => ({ ...prev, formStartedAt: new Date().toISOString() }));
    }, []);

    return (
        <form className="mt-5 space-y-4" onSubmit={submit}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="firstName" className="text-xs text-white/85">First name</label>
                    <input
                        id="firstName"
                        type="text"
                        value={form.firstName}
                        onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                        placeholder="John"
                        className="h-10 w-full rounded-md border-0 bg-black px-3 text-sm text-white placeholder:text-white/35 outline-none focus:ring-1 focus:ring-white/20"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="lastName" className="text-xs text-white/85">Last name</label>
                    <input
                        id="lastName"
                        type="text"
                        value={form.lastName}
                        onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Doe"
                        className="h-10 w-full rounded-md border-0 bg-black px-3 text-sm text-white placeholder:text-white/35 outline-none focus:ring-1 focus:ring-white/20"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-xs text-white/85">Email</label>
                <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                    className="h-10 w-full rounded-md border-0 bg-black px-3 text-sm text-white placeholder:text-white/35 outline-none focus:ring-1 focus:ring-white/20"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="phone" className="text-xs text-white/85">Phone number</label>
                <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 555 123 4567"
                    className="h-10 w-full rounded-md border-0 bg-black px-3 text-sm text-white placeholder:text-white/35 outline-none focus:ring-1 focus:ring-white/20"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="subject" className="text-xs text-white/85">Subject</label>
                <input
                    id="subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                    placeholder="Component request, bug report, general inquiry..."
                    className="h-10 w-full rounded-md border-0 bg-black px-3 text-sm text-white placeholder:text-white/35 outline-none focus:ring-1 focus:ring-white/20"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-xs text-white/85">Message</label>
                <textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us how we can help you..."
                    className="w-full resize-none rounded-md border-0 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:ring-1 focus:ring-white/20"
                    required
                />
            </div>

            <div className="hidden" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                    id="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                />
            </div>

            <input type="hidden" name="formStartedAt" value={form.formStartedAt} readOnly />

            <Button type="submit" className="w-full bg-yellow-500 font-medium text-black hover:bg-yellow-400" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
            </Button>
        </form>
    );
};

export default ContactForm;

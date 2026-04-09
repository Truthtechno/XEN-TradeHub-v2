import { TextHoverEffect } from "@/components/ui/text-hover-effect"

const Footer = () => {
    return (
        <footer className="flex flex-col relative items-center justify-center border-t border-border pt-10 pb-8 w-full bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)]">
            <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-foreground rounded-full"></div>

            <div className="w-full h-[14rem] md:h-[20rem] flex items-center justify-center">
                <TextHoverEffect text="XEN TRADEHUB" />
            </div>

            <div className="mt-4 border-t border-border/40 pt-4 md:pt-6 w-full px-6 lg:px-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} XEN TRADEHUB. All rights reserved.
                </p>
                <p className="text-sm text-muted-foreground md:text-right">
                    Trading Involves Risk. Terms & Conditions Apply
                </p>
            </div>
        </footer>
    )
}

export default Footer

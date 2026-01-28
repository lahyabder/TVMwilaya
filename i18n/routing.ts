import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['ar', 'fr'],

    // Used when no locale matches
    defaultLocale: 'ar',

    // Prefix for default locale (optional, set to 'always' to force /ar)
    localePrefix: 'always'
});

export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);

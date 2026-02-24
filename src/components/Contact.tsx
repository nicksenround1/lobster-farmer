"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Contact() {
  const { t } = useLocale();

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            {t.contact.title}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-3xl mx-auto">
          {/* Twitter */}
          <a
            href="https://x.com/ckn_acee"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 text-center hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-neutral-900 dark:bg-white mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white dark:text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <p className="font-medium text-neutral-900 dark:text-white group-hover:text-red-500 transition-colors">
              {t.contact.twitter}
            </p>
            <p className="text-sm text-neutral-500 mt-1">@ckn_acee</p>
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/+2p-LBUUrJ1BjMjNl"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 text-center hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </div>
            <p className="font-medium text-neutral-900 dark:text-white group-hover:text-blue-500 transition-colors">
              {t.contact.telegram}
            </p>
            <p className="text-sm text-neutral-500 mt-1">养虾户基地</p>
          </a>

          {/* Email */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 dark:bg-red-500/20 mx-auto mb-4 flex items-center justify-center text-2xl">
              📧
            </div>
            <p className="font-medium text-neutral-900 dark:text-white">
              {t.contact.email}
            </p>
            <p className="text-sm text-neutral-500 mt-1">Coming Soon</p>
          </div>
        </div>
      </div>
    </section>
  );
}

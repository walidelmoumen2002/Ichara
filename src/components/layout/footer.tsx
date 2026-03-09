import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MaterialIcon } from "@/components/shared/material-icon";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <MaterialIcon
                name="sign_language"
                className="text-2xl text-primary"
              />
              <span className="text-xl font-bold">Ichara</span>
            </div>
            <p className="text-sm leading-relaxed">{t("description")}</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("learnTitle")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/lessons" className="hover:text-primary transition-colors">
                  {t("lessons")}
                </Link>
              </li>
              <li>
                <Link href="/dictionary" className="hover:text-primary transition-colors">
                  {t("dictionary")}
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-primary transition-colors">
                  {t("practice")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("communityTitle")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/forum" className="hover:text-primary transition-colors">
                  {t("forum")}
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-primary transition-colors">
                  {t("events")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  {t("blog")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("legalTitle")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}

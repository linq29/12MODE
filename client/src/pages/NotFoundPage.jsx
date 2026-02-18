import { Link } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";

export default function NotFoundPage() {
  return (
    <PageLayout
      pageTitle="ページが見つかりません | 十二支詣"
      titleImage="/images/logo-v.png"
      titleAlt="十二支詣"
    >
      <main className="whole">
        <h1 className="jyunishi">ページが見つかりませんでした。</h1>
        <div className="jinja-step-actions">
          <Link className="random-btn" to="/">
            トップへ戻る
          </Link>
        </div>
      </main>
    </PageLayout>
  );
}

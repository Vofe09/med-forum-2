// pages/profile.js
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
          cache: "no-store"
        });
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (mounted) setUser(data);
      } catch {
        router.push("/login");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    } finally {
      router.push("/login");
    }
  };

  if (loading || !user) return null;

  const reputation = user.reputation ?? 0;
  const levelMax = 500;
  const progress = Math.min((reputation / levelMax) * 100, 100);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/css/profile_style.css" />
      </Head>

      <div className="profile-hero">
        <div className="profile-card">

          {/* ACTIONS */}
          <div className="profile-actions">
            <button onClick={() => router.push("/")}>Forum</button>
            <button className="logout" onClick={logout}>Log out</button>
          </div>

          {/* HEADER */}
          <img
            src={user.avatar || "/avatar-placeholder.png"}
            alt="avatar"
            className="profile-avatar"
          />

          <h1 className="profile-name">{user.username}</h1>

          <div className="profile-badges">
            <span className="badge">Статус: Студент медколледжа</span>
            <span className="badge">Год обучения / опыт: 7 лет</span>
            <span className="badge">Направление: Сестринское дело</span>
          </div>

          {/* SCORE */}
          <div className="profile-score">
            <h2>Количество баллов</h2>

            <div className="profile-level">
              <img src="/medic-icon.png" alt="" />
              <div>
                <div className="level-title">Уровень: интересующийся медик</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="progress-text">
                  {reputation}/{levelMax}
                </div>
              </div>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="profile-quick">
            <h2>Быстрая статистика</h2>

            <div className="quick-list">
              <div className="quick-item">📘 Материалов в избранном: 5</div>
              <div className="quick-item">✅ Пройдено тем: 23</div>
              <div className="quick-item">⭐ Добавлено пользователем: 2</div>
              <div className="quick-item">➕ Создано тем на форуме: {user.posts_count ?? 0}</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

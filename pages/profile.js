import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getRankByReputation } from "../utils/ranks";

export default function Profile() {
  const router = useRouter();
  const { test_code } = router.query;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [codeConsumed, setCodeConsumed] = useState(false);

  // ======================
  // LOAD USER
  // ======================
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
          cache: "no-store",
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

    return () => {
      mounted = false;
    };
  }, []);

  // ======================
  // CONSUME TEST CODE
  // ======================
  useEffect(() => {
    if (!test_code || codeConsumed || loading) return;

    (async () => {
      try {
        await fetch("/api/test-code/consume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ code: test_code }),
        });
      } finally {
        setCodeConsumed(true);

        // 🔥 убираем код из URL, чтобы не было повторного списания
        router.replace("/profile", undefined, { shallow: true });
      }
    })();
  }, [test_code, codeConsumed, loading]);

  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/login");
    }
  };

  if (loading || !user) return null;

  /* ======================
     RANK LOGIC
     ====================== */
  const reputation = user.reputation ?? 0;
  const rank = getRankByReputation(reputation);

  const rankMin = rank.min;
  const rankMax = rank.max;

  const progress =
    rankMax === Infinity
      ? 100
      : Math.min(
          ((reputation - rankMin) / (rankMax - rankMin)) * 100,
          100
        );

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/css/profile_style.css" />
      </Head>

      <div className="profile-hero">
        <div className="profile-card">

          {/* ACTIONS */}
          <div className="profile-actions">
            <button onClick={() => router.push("/forum")}>Forum</button>
            <button className="logout" onClick={logout}>Log out</button>
            <button onClick={() => router.push("/profile/edit")}>
              Редактировать
            </button>
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

            <span className="badge">
              Год обучения: {user.study_year || "—"}
            </span>

            <span className="badge">
              Направление: {user.direction || "—"}
            </span>

            {/* RANK BADGE */}
            <span
              className="badge"
              style={{
                background: rank.color,
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Ранг: {rank.name}
            </span>
          </div>

          {/* SCORE */}
          <div className="profile-score">
            <h2>Количество баллов</h2>

            <div className="profile-level">
              <img src="/medic-icon.png" alt="" />

              <div>
                <div className="level-title">
                  Уровень:{" "}
                  <span style={{ color: rank.color, fontWeight: 700 }}>
                    {rank.name}
                  </span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="progress-text">
                  {reputation} / {rankMax === Infinity ? "∞" : rankMax}
                </div>
              </div>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="profile-quick">
            <h2>Быстрая статистика</h2>

            <div className="quick-list">
              <div className="quick-item">
                🧪 Пройдено тестов: {user.tests_passed ?? 0}
              </div>
              <div className="quick-item">
                ⭐ Отправленно сообщений: 0
              </div>
              <div className="quick-item">
                ➕ Создано тем на форуме: {user.posts_count ?? 0}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

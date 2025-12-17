// pages/profile/edit.js
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const YEARS = [
  "1 курс",
  "2 курс",
  "3 курс",
  "4 курс",
  "Выпускник",
  // 🔮 будущее
  "Учитель",
  "Работник"
];

const DIRECTIONS = [
  "Сестринское дело",
  "Лечебное дело",
  "Стоматология"
];

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [year, setYear] = useState("");
  const [direction, setDirection] = useState("");

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
        if (!mounted) return;

        setUser(data);
        setYear(data.study_year || "");
        setDirection(data.direction || "");
      } catch {
        router.push("/login");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          study_year: year,
          direction
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Ошибка сохранения");
      }

      router.push("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return null;

  return (
    <>
      <Head>
        <title>Редактирование профиля</title>
        <link rel="stylesheet" href="/css/profile_style.css" />
      </Head>

      <div className="profile-hero">
        <div className="profile-card">

          <h1 className="profile-name">Редактирование профиля</h1>

          {error && (
            <div style={{ color: "crimson", marginBottom: 12 }}>
              {error}
            </div>
          )}

          {/* YEAR */}
          <div className="edit-field">
            <label>Год обучения / статус</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">— выбрать —</option>
              {YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* DIRECTION */}
          <div className="edit-field">
            <label>Направление</label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            >
              <option value="">— выбрать —</option>
              {DIRECTIONS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button onClick={() => router.push("/profile")}>
              Отмена
            </button>

            <button onClick={save} disabled={saving}>
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

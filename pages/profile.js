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
        const res = await fetch("/api/me", { credentials: "include" });
        if (!res.ok) {
          // если не авторизован — редирект
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (mounted) setUser(data);
      } catch (err) {
        console.error("PROFILE: /api/me error", err);
        router.push("/login");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("LOGOUT ERROR:", err);
    } finally {
      // на клиенте просто редиректим на логин; cookie удалится сервером
      router.push("/login");
    }
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/css/profile_style.css" />
      </Head>

      <div className="profile-hero">
        <div className="profile-card">
          <div className="profile-actions" style={{ alignSelf: "flex-end" }}>
            <button onClick={() => router.push("/")}>Forum</button>
            <button className="logout" onClick={logout}>Log out</button>
          </div>

          <img src={user.avatar || "/avatar-placeholder.png"} alt="avatar" />

          <h1>{user.username}</h1>
          <p>{user.email}</p>

          <div className="profile-stats">
            <div>
              <strong>{user.posts_count ?? 0}</strong>
              <span>Posts</span>
            </div>
            <div>
              <strong>0</strong>
              <span>Comments</span>
            </div>
            <div>
              <strong>{user.reputation ?? 0}</strong>
              <span>Reputation</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

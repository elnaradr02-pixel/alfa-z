// Формат креатива берётся из ?f=feed|story (по умолчанию feed)
document.body.classList.add(new URLSearchParams(location.search).get("f") === "story" ? "story" : "feed");

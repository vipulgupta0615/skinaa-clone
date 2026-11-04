export default function StorePageHero({ eyebrow, title, description, actionHref, actionLabel }) {
  return (
    <section className="store-page-hero">
      <div className="store-page-hero-copy">
        <p className="eyebrow"><span className="live-dot" />{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        {actionHref && actionLabel && <a className="button dark" href={actionHref}>{actionLabel}<span aria-hidden="true">↗</span></a>}
      </div>
      <div className="store-page-hero-art" role="img" aria-label="SKINAA daily skincare packaging concept">
        <span className="store-hero-orbit store-hero-orbit-one" />
        <span className="store-hero-orbit store-hero-orbit-two" />
        <span className="store-hero-glow" />
        <div className="store-hero-product">
          <div className="store-hero-cap" />
          <div className="store-hero-label">
            <span>SKINAA</span>
            <small>DERMATOLOGY + DAILY CARE</small>
            <strong>AQUA</strong>
            <em>sun gel</em>
            <b>50<small>SPF +</small></b>
            <small>HYALURONIC ACID<br />50 ml / 1.69 fl. oz.</small>
          </div>
        </div>
        <span className="store-hero-tag">DAILY DEFENCE <b>✳ SPF 50+</b></span>
        <span className="store-hero-caption">SKINCARE, WITH A LITTLE MORE FEELING.</span>
      </div>
    </section>
  );
}

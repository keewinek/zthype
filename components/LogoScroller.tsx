export default function LogoScroller() {
  const logos = [
    "/src/brand/zthype_blog_white_logo_text_color_transparent.png",
    "/src/bobrlog_logo.png",
    "/src/literno_logo.png",
    "/src/pder_logo.png",
    "/src/keblogz_logo.png",
    "/src/actropira_logo.png",
    "/src/evenciarze_logo.png",
    "/src/ligcis_logo.png",
    "/src/qulia_logo.png",
    "/src/socjovibe_logo.png",
    "/src/mcbump_logo.png",
    "/src/rbxvibecoder_logo.png",
    "/src/tiltz_games_logo.png",
  ];

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div class="logo-scroller-container overflow-hidden w-full my-8">
      <div class="logo-scroller flex items-center gap-4 max-md:gap-3">
        {duplicatedLogos.map((logo, index) => (
          <img
            key={`${logo}-${index}`}
            src={logo}
            alt="Partner logo"
            class="h-12 max-md:h-8 object-contain flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        ))}
      </div>
    </div>
  );
}


export default function BottomFooter() {
  return (
    <footer class="bg-background text-white text-center py-4 w-full mt-12">
      <div class="text-sm text-gray flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4">
        <a href="/regulamin" class="hover:underline">Regulamin</a>
        <span class="opacity-40">·</span>
        <a href="/polityka-prywatnosci" class="hover:underline">
          Polityka prywatności
        </a>
        <span class="opacity-40">·</span>
        <a
          href="https://instagram.com/zt.hype"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:underline"
        >
          Kontakt: @zt.hype
        </a>
      </div>
      <p class="text-xs text-gray mt-2 px-4">
        © {new Date().getFullYear()} ZTHype
      </p>
    </footer>
  );
}

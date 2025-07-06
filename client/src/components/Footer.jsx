export function Footer() {
  return (
    <div className="flex justify-center items-center mx-auto w-full max-w-2xl">
      <div>
        <p className="text-sm tracking-tight">
          &copy; {new Date().getFullYear()} Catatanku. All rights reserved.
        </p>
      </div>
    </div>
  );
}

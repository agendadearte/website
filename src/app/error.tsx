"use client";

import Link from "next/link";

export default function Error() {
  return (
    <>
      <h1>No hemos podido encontrar el evento.</h1>
      <p>
        Es posible que ya haya concluido o que la URL no sea correcta.
        <br />
        Prueba a buscarlo de nuevo en la <Link href="/">página de inicio</Link>
      </p>
    </>
  );
}

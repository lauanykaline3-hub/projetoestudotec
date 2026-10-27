"use client";

import { useState } from "react";

type ParticipanteAvatarProps = {
  nome: string;
  foto?: string;
  colorClass: string;
};

export function ParticipanteAvatar({ nome, foto, colorClass }: ParticipanteAvatarProps) {
  const [error, setError] = useState(false);

  const iniciais = nome
    .split(" ")
    .map((parte) => parte[0])
    .join("");

  // Se houver foto e ela não tiver falhado, exibe a imagem
  if (foto && !error) {
    return (
      <div className="mx-auto h-20 w-20 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={foto}
          alt={`Foto de ${nome}`}
          className="h-full w-full object-cover object-top"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  // Fallback caso a foto não seja informada, quebre ou falhe ao carregar
  return (
    <span
      className={`mx-auto grid h-20 w-20 place-items-center rounded-2xl text-xl font-bold ${colorClass}`}
      aria-hidden="true"
    >
      {iniciais}
    </span>
  );
}


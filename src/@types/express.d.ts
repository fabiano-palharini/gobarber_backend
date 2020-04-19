// quandos se "d" no nome do arquivo como "zxc.d.ts" estamos dizendo que é uma definicao de tipos.
// sobrescreve uma definicao de tipos, desse caso do Express. Nao sobrescreve necessariamente, ele anexa à original
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}

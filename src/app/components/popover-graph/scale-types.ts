export enum ScaleTypes {
    // 🟦 - no thresholds
    O = 'O',

    // 🟨🟩
    W_O = 'W<O',

    // 🟥🟨🟩
    C_W_O = 'C<W<O',

    // 🟩🟨
    O_W = 'O<W',

    // 🟩🟨🟥
    O_W_C = 'O<W<C',

    // 🟥🟨🟩🟨🟥
    C_W_O_W_C = 'C<W<O<W<C',

    // 🟩🟨🟥🟨🟩
    O_W_C_W_O = 'O<W<C<W<O'
}

declare function jskawari(): {
    call(entry: string): string;
    insert(entry: string): (...words: string[]) => void;
    clear(entry: string): void;
    set(entry: string): (...words: string[]) => void;
    find(entry: string, word: string): boolean;
    enumerate(entry: string): string[];
    addfunc(funcname: string): (funcbody: (...args: string[]) => string) => void;
    loadobj(dicobj: {
        [key: string]: string[];
    }): void;
};
export default jskawari;

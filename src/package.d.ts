/**
 * Read package.json
 * @param {string} cwd the current working directory
 * @returns {object} the contents of package.json
 */
export function readPackageJSON(cwd?: string): object;
/**
 * package.json
 */
export class Package {
    /**
     * @type {Package}
     */
    static #instance: Package;
    /**
     * Name
     * @type {string}
     */
    name: string;
    /**
     * Version
     * @type {string}
     */
    version: string;
    /**
     * Description
     * @type {string}
     */
    description: string;
    /**
     * Keywords
     * @type {string[]}
     */
    keywords: string[];
    /**
     * Repository
     * @type {string}
     */
    repository: string;
    /**
     * Author
     * @type {string}
     */
    author: string;
    /**
     * License
     * @type {string}
     */
    license: string;
    /**
     * Type
     * @type {string}
     */
    type: string;
    /**
     * Bin
     * @type {object}
     */
    bin: object;
    /**
     * Exports
     * @type {{[key: string]: {[key: string]: string}}}
     */
    exports: {
        [key: string]: {
            [key: string]: string;
        };
    };
    /**
     * Engines
     * @type {object}
     */
    engines: object;
    /**
     * Dependencies
     * @type {object}
     */
    dependencies: object;
    /**
     * devDependencies
     * @type {object}
     */
    devDependencies: object;
    /**
     * Refresh package.json contents
     */
    refresh(): void;
    /**
     * Resolve the 'exports' field
     * @returns {string} Default entry-point
     */
    resolve(): string;
}

/**
 * @typedef {object} PackageJSON
 * @property {string} [name] name
 * @property {string} [version] version
 * @property {string} [description] description
 * @property {Array<string>} [keywords] keywords
 * @property {string} [repository] repository
 * @property {string} [author] author
 * @property {string} [license] license
 * @property {string} [type] type
 * @property {object} [bin] bin
 * @property {object} [exports] exports
 * @property {object} [scripts] scripts
 * @property {object} [engines] engines
 * @property {object} [dependencies] dependencies
 * @property {object} [devDependencies] devDependencies
 */
/**
 * Read package.json
 * @param {string} cwd the current working directory
 * @returns {Promise<PackageJSON>} the contents of package.json
 */
export function readPackageJSON(cwd?: string): Promise<PackageJSON>;
export type PackageJSON = {
    /**
     * name
     */
    name?: string | undefined;
    /**
     * version
     */
    version?: string | undefined;
    /**
     * description
     */
    description?: string | undefined;
    /**
     * keywords
     */
    keywords?: string[] | undefined;
    /**
     * repository
     */
    repository?: string | undefined;
    /**
     * author
     */
    author?: string | undefined;
    /**
     * license
     */
    license?: string | undefined;
    /**
     * type
     */
    type?: string | undefined;
    /**
     * bin
     */
    bin?: object | undefined;
    /**
     * exports
     */
    exports?: object | undefined;
    /**
     * scripts
     */
    scripts?: object | undefined;
    /**
     * engines
     */
    engines?: object | undefined;
    /**
     * dependencies
     */
    dependencies?: object | undefined;
    /**
     * devDependencies
     */
    devDependencies?: object | undefined;
};

import PostgrestQueryBuilder from './lib/PostgrestQueryBuilder';
import PostgrestRpcBuilder from './lib/PostgrestRpcBuilder';
import PostgrestFilterBuilder from './lib/PostgrestFilterBuilder';

export default class PostgrestClient {
	url: string;
	headers: { [key: string]: string };
	schema?: string;

	/**
	 * Creates a PostgREST client.
	 *
	 * @param url  URL of the PostgREST endpoint.
	 * @param headers  Custom headers.
	 * @param schema  Postgres schema to switch to.
	 */
	constructor(url: string, { headers = {}, schema }: { headers?: { [key: string]: string }; schema?: string } = {}) {
		this.url = url;
		this.headers = headers;
		this.schema = schema;
	}

	/**
	 * Authenticates the request with JWT.
	 *
	 * @param token  The JWT token to use.
	 */
	auth(token: string): this {
		this.headers['Authorization'] = `Bearer ${token}`;
		return this;
	}

	/**
	 * Perform a table operation.
	 *
	 * @param table  The table name to operate on.
	 */
	from<T = any>(table: string): PostgrestQueryBuilder<T> {
		const url = `${this.url}/${table}`;
		return new PostgrestQueryBuilder<T>(url, { headers: this.headers, schema: this.schema });
	}

	/**
	 * Perform a stored procedure call.
	 *
	 * @param fn  The function name to call.
	 * @param params  The parameters to pass to the function call.
	 * @param count  Count algorithm to use to count rows in a table.
	 */
	rpc<T = any>(
		fn: string,
		params?: object,
		{
			count = null,
		}: {
			count?: null | 'exact' | 'planned' | 'estimated';
		} = {}
	): PostgrestFilterBuilder<T> {
		const url = `${this.url}/rpc/${fn}`;
		return new PostgrestRpcBuilder<T>(url, {
			headers: this.headers,
			schema: this.schema,
		}).rpc(params, { count });
	}
}

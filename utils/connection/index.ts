import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';

import utils from './utils';

enum Method {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
}

interface Config {
    baseURL?: string;
    url?: string;
    body?: string | object;
    headers?: {
        Authorization?: string;
        'Content-Type'?: string;
    };
}

const defaultConfig: Config = {
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: { Authorization: '' },
};

export default class Connector {
    private static async before(method: Method, url: string, data?: any, config?: any) {
        let clonedConfig: Config = cloneDeep(defaultConfig);
        const token = '';
        config = config || {};
        if (!isEmpty(data) && !utils.isFormData(data)) {
            clonedConfig!['body'] = JSON.stringify(data);
            clonedConfig.headers!['Content-Type'] = 'application/json';
        }
        if (utils.isFormData(data) && !data?.entries().next().done) {
            clonedConfig!['body'] = data;
        }
        if (token) {
            clonedConfig.headers!['Authorization'] = `Bearer ${token}`;
        }
        config = utils.mergeConfig(clonedConfig, config);
        config.method = method;
        config.url = utils.buildFullPath(config.baseURL, url);
        return config;
    }

    private static async after(response: any) {
        if (response.status === 401) {
            // await handleLogout();
            return;
        }
        response.data = await response.json();
        return response;
    }

    private static async execution(method: Method, url: string, data?: any, config?: any) {
        const mergedConfig = await Connector.before(method, url, data, config);
        const response = await fetch(mergedConfig.url, mergedConfig);
        return await Connector.after(response);
    }

    async get(url: string, config?: any) {
        return await Connector.execution(Method.GET, url, undefined, config);
    }

    async post(url: string, data: object, config?: any) {
        return await Connector.execution(Method.POST, url, data, config);
    }

    async delete(url: string, config?: any) {
        return await Connector.execution(Method.DELETE, url, undefined, config);
    }
}
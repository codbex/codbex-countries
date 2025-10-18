import { Controller, Get, Post, Put, Delete, request, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { user } from "sdk/security"
import { ForbiddenError, ValidationError } from "sdk/http/errors";
import { HttpUtils } from "sdk/http/utils";
import { Options } from "sdk/db";
import { CountryEntity } from "../../data/Settings/CountryEntity";
import { CountryRepository } from "../../data/Settings/CountryRepository";

const validationModules = await Extensions.loadExtensionModules("codbex-countries-Settings-Country", ["validate"]);

@Controller
class CountryController {

    private readonly repository = new CountryRepository();

    @Get("/")
    public getAll(_: CountryEntity, ctx: any): CountryEntity[] {
        try {
            this.checkPermissions("read");
            const options: Options = {
                limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : 20,
                offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : 0,
                language: request.getLocale().slice(0, 2)
            };

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
        return [];
    }

    @Post("/")
    public create(entity: CountryEntity): CountryEntity {
        try {
            this.checkPermissions("write");
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity) as number;
            response.setHeader("Content-Location", "/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryController.ts/" + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return new CountryEntity();
    }

    @Get("/count")
    public count(): number {
        try {
            this.checkPermissions("read");
            return this.repository.count();
        } catch (error: any) {
            this.handleError(error);
        }
        return -1;
    }

    @Post("/count")
    public countWithFilter(filter: any): number {
        try {
            this.checkPermissions("read");
            return this.repository.count(filter.$filter);
        } catch (error: any) {
            this.handleError(error);
        }
        return -1;
    }

    @Post("/search")
    public search(filter: any) {
        try {
            this.checkPermissions("read");
            return this.repository.findAll(filter.$filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/:id")
    public getById(id: number, ctx: any): CountryEntity[] {
        try {
            this.checkPermissions("read");
            const id = parseInt(ctx.pathParameters.id);
            const options: Options = {
                language: request.getLocale().slice(0, 2)
            };
            const entity = this.repository.findById(id, options);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound("Country not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
        return new CountryEntity();
    }

    @Put("/:id")
    public update(entity: CountryEntity, ctx: any): CountryEntity {
        try {
            this.checkPermissions("write");
            entity.Id = ctx.pathParameters.id;
            this.validateEntity(entity);
            this.repository.update(entity);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return new CountryEntity();
    }

    @Delete("/:id")
    public deleteById(_: any, ctx: any) {
        try {
            this.checkPermissions("write");
            const id = ctx.pathParameters.id;
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound("Country not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === "ForbiddenError") {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === "ValidationError") {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

    private checkPermissions(operationType: string) {
        if (operationType === "read" && !(user.isInRole("codbex-countries.Countries.CountryReadOnly") || user.isInRole("codbex-countries.Countries.CountryFullAccess"))) {
            throw new ForbiddenError();
        }
        if (operationType === "write" && !user.isInRole("codbex-countries.Countries.CountryFullAccess")) {
            throw new ForbiddenError();
        }
    }

    private validateEntity(entity: CountryEntity): void {
        if (entity.Name!.length > 255) {
            throw new ValidationError(`The 'Name' exceeds the maximum length of [255] characters`);
        }
        if (entity.Code2!.length > 2) {
            throw new ValidationError(`The 'Code2' exceeds the maximum length of [2] characters`);
        }
        if (entity.Code3!.length > 3) {
            throw new ValidationError(`The 'Code3' exceeds the maximum length of [3] characters`);
        }
        if (entity.Numeric!.length > 3) {
            throw new ValidationError(`The 'Numeric' exceeds the maximum length of [3] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}

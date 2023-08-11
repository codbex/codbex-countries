# Docker descriptor for codbex-countries
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:0.5.0

COPY codbex-countries target/dirigible/repository/root/registry/public/codbex-countries

COPY codbex-countries-data target/dirigible/repository/root/registry/public/codbex-countries-data

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-countries/gen/index.html

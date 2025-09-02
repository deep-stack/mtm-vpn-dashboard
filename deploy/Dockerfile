ARG VARIANT=20-bullseye
FROM node:${VARIANT}

ARG USERNAME=node
ARG NPM_GLOBAL=/usr/local/share/npm-global

# Add NPM global to PATH.
ENV PATH=${NPM_GLOBAL}/bin:${PATH}

RUN \
    # Configure global npm install location, use group to adapt to UID/GID changes
    if ! cat /etc/group | grep -e "^npm:" > /dev/null 2>&1; then groupadd -r npm; fi \
    && usermod -a -G npm ${USERNAME} \
    && umask 0002 \
    && mkdir -p ${NPM_GLOBAL} \
    && touch /usr/local/etc/npmrc \
    && chown ${USERNAME}:npm ${NPM_GLOBAL} /usr/local/etc/npmrc \
    && chmod g+s ${NPM_GLOBAL} \
    && npm config -g set prefix ${NPM_GLOBAL} \
    && su ${USERNAME} -c "npm config -g set prefix ${NPM_GLOBAL}" \
    # Install eslint
    && su ${USERNAME} -c "umask 0002 && npm install -g eslint" \
    && npm cache clean --force > /dev/null 2>&1

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends jq bash

# laconic-so
RUN curl -LO https://git.vdb.to/cerc-io/stack-orchestrator/releases/download/latest/laconic-so && \
chmod +x ./laconic-so && \
mv ./laconic-so /usr/bin/laconic-so

# Configure the npm registry
RUN npm config set @cerc-io:registry https://git.vdb.to/api/packages/cerc-io/npm/

# DEBUG, remove
RUN yarn info @cerc-io/laconic-registry-cli

# Globally install the cli package
RUN yarn global add @cerc-io/laconic-registry-cli

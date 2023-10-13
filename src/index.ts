import { factory, NetworkClient } from "@lumeweb/libkernel/module";
import type { SignedRegistryEntry } from "@lumeweb/libs5";

export const MODULE =
  "zrjLjKVByzt233rfcjWvTQXrMfGFa11oBLydPaUk7gwnC2d";

export interface RegistryEntry {
  key: Uint8Array;
  data: Uint8Array;
  revision: number;
}

export class S5Client extends NetworkClient {
  public async getRegistryEntry(pubkey: Uint8Array | Buffer | string) {
    return this.callModuleReturn("getRegistryEntry", { pubkey });
  }

  public async setRegistryEntry({
    key,
    data,
    revision,
  }: RegistryEntry): Promise<SignedRegistryEntry> {
    return this.callModuleReturn("setRegistryEntry", { key, data, revision });
  }

  public registrySubscription(
    pubkey: Uint8Array,
    cb: (sre: SignedRegistryEntry) => void,
  ): () => void {
    let done = false;

    const [end, ret] = this.connectModule(
      "registrySubscription",
      { pubkey },
      cb,
    );

    ret.then((ret) => {
      this.handleError(ret);
    });

    return () => {
      if (done) {
        return;
      }
      done = true;
      end();
    };
  }
}

export const createClient = factory<S5Client>(S5Client, MODULE);

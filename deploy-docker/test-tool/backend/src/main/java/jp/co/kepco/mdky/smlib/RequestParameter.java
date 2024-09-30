package jp.co.kepco.mdky.smlib;

/**
 * シミュレータ ハンドラー リクエストパラメータ
 */
public class RequestParameter {
    /** シミュレータ設定ファイルの保存先S3バケット */
    public String bucket;

    /** シミュレータ設定ファイルの保存先S3キー */
    public String key;
}

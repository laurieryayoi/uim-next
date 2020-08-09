<?php

namespace App\Services;

use App\Models\NextConfig;

class NextDefaultConfig
{
    /**
     * 创建配置，成功返回 true
     *
     * @param string $key 键名
     *
     * @return bool
     */
    public static function create($key)
    {
        $value = self::default_value($key);
        if ($value != null) {
            $new                 = new NextConfig();
            $new->key            = $value['key'];
            $new->type           = $value['type'];
            $new->value          = $value['value'];
            $new->name           = $value['name'];
            $new->comment        = $value['comment'];
            if ($new->save()) {
                return true;
            }
        }
        return false;
    }

    /**
     * 创建并返回配置，如果该键名存在默认配置中
     *
     * @param string $key
     *
     * @return NextConfig|null
     */
    public static function firstOrCreate($key)
    {
        return (self::create($key)
            ? NextConfig::where('key', '=', $key)->first()
            : null
        );
    }

    /**
     * 检查新增的配置并创建
     *
     * @return string
     */
    public static function detectConfigs()
    {
        $return = '开始检查新增的Next配置项...' . PHP_EOL;
        $configs = self::configs();
        foreach ($configs as $key => $value) {
            if (NextConfig::where('key', '=', $key)->first() == null) {
                if (self::create($key)) {
                    $return .= '新增的配置项：' . $key . '：' . $value['name'] . PHP_EOL;
                } else {
                    $return .= $key . '：配置项创建失败，请检查错误' . PHP_EOL;
                }
            }
        }
        $return .= '以上是新增的配置项...' . PHP_EOL;

        return $return;
    }

    /**
     * 默认配置，新增配置请添加到此处
     *
     * @param string $key 键名
     *
     * @return array
     */
    public static function configs($key = null)
    {
        $configs = [
            'custom_tutorial' => [
                'key'           => $key,
                'type'          => 'bool',
                'value'         => 0,
                'name'          => '自定义教程',
                'comment'       => '是否开启自定义教程',
            ],
            'custom_tutorial_url' => [
                'key'           => $key,
                'type'          => 'string',
                'value'         => '',
                'name'          => '自定义教程链接',
                'comment'       => '开启自定义教程后自定义的教程链接',
            ],
            'tutorials' => [
                'key'           => $key,
                'type'          => 'string',
                'value'         => '',
                'name'          => '教程编辑数据',
                'comment'       => '关闭自定义教程后添加的教程',
            ],
            'custom_downloads' => [
                'key'           => $key,
                'type'          => 'string',
                'value'         => '{"first":{"option1":[{"name":"SSRR Windows","link":"/ssr-download/ssr-win.7z"},{"name":"SSTap","link":"/ssr-download/SSTap.7z"},{"name":"Clash","link":"/ssr-download/Clash-Windows.7z"},{"name":"Netch","link":"/ssr-download/netch-windows.zip"}],"option2":[{"name":"ShadowsocksX-NG-R8","link":"/ssr-download/ssr-mac.dmg"},{"name":"ClashX","link":"/ssr-download/ClashX.dmg"}],"option3":[{"name":"Electron SSR","link":"/ssr-download/ssr-linux.AppImage"}],"option4":[{"name":"SSRR","link":"/ssr-download/ssrr-android.apk"},{"name":"SSR","link":"/ssr-download/ssr-android.apk"}],"option5":[{"name":"Apple Store","link":"javascript:void(0)"}],"option6":[{"name":"FancySS","link":"https://github.com/hq450/fancyss_history_package"}]},"second":{"option1":[{"name":"SSD Windows","link":"/ssr-download/ssd-win.7z"},{"name":"Shadowsocks Windows","link":"/ssr-download/ss-win.zip"},{"name":"SSTap","link":"/ssr-download/SSTap.7z"},{"name":"Clash","link":"/ssr-download/Clash-Windows.7z"},{"name":"Netch","link":"/ssr-download/netch-windows.zip"}],"option2":[{"name":"ShadowsocksX-NG","link":"/ssr-download/ss-mac.zip"},{"name":"ClashX","link":"/ssr-download/ClashX.dmg"}],"option3":[{"name":"Electron SSR","link":"/ssr-download/ssr-linux.AppImage"}],"option4":[{"name":"Shadowsocks Android","link":"/ssr-download/ss-android.apk"},{"name":"SSD Android","link":"/ssr-download/ssd-android.apk"},{"name":"Simple-Obfs 混淆插件","link":"/ssr-download/ss-android-obfs.apk"}],"option5":[{"name":"Apple Store","link":"javascript:void(0)"}],"option6":[{"name":"FancySS","link":"https://github.com/hq450/fancyss_history_package"}]},"third":{"option1":[{"name":"V2RayN","link":"/ssr-download/v2rayn.zip"},{"name":"Clash","link":"/ssr-download/Clash-Windows.7z"},{"name":"Netch","link":"/ssr-download/netch-windows.zip"}],"option2":[{"name":"V2RayU","link":"/ssr-download/V2rayU.dmg"},{"name":"ClashX","link":"/ssr-download/ClashX.dmg"}],"option3":[{"name":"很抱歉，暂无推荐客户端","link":"javascript:void(0)"}],"option4":[{"name":"V2RayNG","link":"/ssr-download/v2rayng.apk"},{"name":"Clash","link":"/ssr-download/clash-android.apk"}],"option5":[{"name":"Apple Store","link":"javascript:void(0)"}],"option6":[{"name":"FancySS","link":"https://github.com/hq450/fancyss_history_package"}]}}',
                'name'          => '自定义下载链接',
                'comment'       => '自定义用户中心的下载链接',
            ]
        ];
        return ($key === null
            ? $configs
            : $configs[$key]
        );
    }

    /**
     * 恢复配置为默认值
     *
     * @param string $key 键名
     *
     * @return void
     */
    public static function default_value($key)
    {
        return self::configs($key);
    }
}
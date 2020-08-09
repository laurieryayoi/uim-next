<?php

namespace App\Controllers\Admin;

use App\Controllers\AdminController;
use App\Models\NextConfig;
use Psr\Http\Message\ResponseInterface;

class NextController extends AdminController
{
    /**
     * @param Request   $request
     * @param Response  $response
     * @param array     $args
     */
    public function update($request, $response, $args): ResponseInterface
    {
        $key    = trim($args['key']);
        $user   = $this->user;
        $config = NextConfig::where('key', '=', $key)->first();
        if ($config != null && $config->setValue($request->getParam('value'), $user) === true) {
            return $response->write(
                json_encode(
                    [
                    'ret' => 1,
                    'msg' => '修改成功'
                    ]
                )
            );
        }
        return $response->write(
            json_encode(
                [
                    'ret' => 0,
                    'msg' => '修改失败'
                ]
            )
        );
    }

    /**
     * @param Request   $request
     * @param Response  $response
     * @param array     $args
     */
    public function nextConfig($request, $response, $args): ResponseInterface
    {
        return $response->write(
            $this->view()
                ->fetch('admin/config/next_config.tpl')
        );
    }
}
